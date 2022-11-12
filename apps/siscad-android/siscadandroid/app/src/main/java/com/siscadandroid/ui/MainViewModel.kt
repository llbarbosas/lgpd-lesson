package com.siscadandroid.ui

import androidx.lifecycle.ViewModel
import com.siscadandroid.data.LoginRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    loginRepository: LoginRepository
) : ViewModel() {
    private val _isUserLoggedIn = MutableStateFlow(loginRepository.isLoggedIn)
    val isUserLoggedIn: StateFlow<Boolean> = _isUserLoggedIn
}