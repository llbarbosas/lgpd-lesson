package com.siscadandroid.ui.home

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

data class HomeUiState(
    val usersSharedProfilesList: List<String> = emptyList()
)

@HiltViewModel
class HomeViewModel @Inject constructor() : ViewModel() {
    private val _homeUiState = MutableStateFlow(
        HomeUiState(
            usersSharedProfilesList = listOf(
                "Exemplo de nome",
                "Exemplo de nome",
                "Exemplo de nome",
                "Exemplo de nome",
            )
        )
    )
    val homeUiState: StateFlow<HomeUiState> = _homeUiState

    init {
    }
}