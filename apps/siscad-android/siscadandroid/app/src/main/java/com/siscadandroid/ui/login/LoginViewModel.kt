package com.siscadandroid.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.siscadandroid.data.repositories.PassportRepository
import com.siscadandroid.data.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val passportRepository: PassportRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<LoginUiState?>(null)

    val uiState: StateFlow<LoginUiState?> = _uiState

    fun login(username: String, password: String) {
        viewModelScope.launch {
            passportRepository.login(username, password)
                .collect { loginResult ->
                    _uiState.value = when (loginResult) {
                        is Result.Success -> LoginUiState.Success(
                            successMessage = "Login realizado com sucesso"
                        )

                        is Result.Error -> LoginUiState.Error(Exception("Falha no login"))
                    }
                }
        }
    }
}