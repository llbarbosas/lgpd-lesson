package com.siscadandroid.ui.login

/**
 * Authentication result : success (user details) or error exception.
 */
sealed class LoginUiState {
    data class Success(
        val successMessage: String
    ) : LoginUiState()

    data class Error(
        val exception: Exception
    ) : LoginUiState()
}