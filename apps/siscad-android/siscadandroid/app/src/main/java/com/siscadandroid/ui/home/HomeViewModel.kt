package com.siscadandroid.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.siscadandroid.data.Result
import com.siscadandroid.data.model.ProfileInformationResponse
import com.siscadandroid.data.repositories.SiscadRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val profileInformationResponse: ProfileInformationResponse? = null,
    val error: String? = null,
    val accessRequestedMessage: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val siscadRepository: SiscadRepository
) : ViewModel() {
    private val _homeUiState = MutableStateFlow(HomeUiState())
    val homeUiState: StateFlow<HomeUiState> = _homeUiState

    init {
        getProfiles()
    }

    fun clearAccessRequestedMessage() {
        _homeUiState.value = _homeUiState.value.copy(
            accessRequestedMessage = null,
            error = null
        )
    }

    fun requestProfileAccess(userName: String) {
        viewModelScope.launch {
            siscadRepository.requestAccess(userName).collect { requestAccessResponse ->
                _homeUiState.value = when (requestAccessResponse) {
                    is Result.Success -> _homeUiState.value.copy(
                        accessRequestedMessage = "Acesso solicitado com sucesso"
                    )
                    is Result.Error -> _homeUiState.value.copy(
                        accessRequestedMessage = "Não foi possível realizar a solicitação",
                    )
                }
            }
        }
    }

    fun authorizeProfileAccess(password: String, requesterUserId: String) {
        viewModelScope.launch {
            siscadRepository.authorizeAccess(
                password = password,
                requesterUserId = requesterUserId,
                currentStudentProfileId = _homeUiState.value.profileInformationResponse?.profile?.id ?: ""
            ).collect { requestAccessResponse ->
            _homeUiState.value = when (requestAccessResponse) {
                is Result.Success -> _homeUiState.value.copy(
                    accessRequestedMessage = "Acesso concedido com sucesso"
                )
                is Result.Error -> _homeUiState.value.copy(
                    accessRequestedMessage = "Não foi possível realizar o consentimento do acesso",
                )
            }
        }
        }
    }

    private fun getProfiles() {
        viewModelScope.launch {
            siscadRepository.getProfiles().collect { profilesResult ->
                _homeUiState.value = when (profilesResult) {
                    is Result.Success -> _homeUiState.value.copy(
                        profileInformationResponse = profilesResult.data,
                        error = null
                    )
                    is Result.Error -> _homeUiState.value.copy(
                        profileInformationResponse = null,
                        error = "Não foi possível completar a operação"
                    )
                }
            }
        }
    }
}