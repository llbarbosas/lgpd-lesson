package com.siscadandroid.ui

import androidx.lifecycle.ViewModel
import com.siscadandroid.data.repositories.PassportRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    passportRepository: PassportRepository
) : ViewModel() {
    private val _isUserLoggedIn = MutableStateFlow(passportRepository.isLoggedIn)
    val isUserLoggedIn: StateFlow<Boolean> = _isUserLoggedIn

}