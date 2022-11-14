package com.siscadandroid.ui.login

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.siscadandroid.R
import com.siscadandroid.databinding.ActivityLoginBinding
import com.siscadandroid.ui.home.HomeActivity
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {

    private val loginViewModel: LoginViewModel by viewModels()
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        subscribeUi()
        setupUi()
    }

    private fun setupUi() = with(binding) {
        etPassword.apply {
            setOnEditorActionListener { _, actionId, _ ->
                when (actionId) {
                    EditorInfo.IME_ACTION_DONE ->
                        loginViewModel.login(
                            etUsername.text.toString(),
                            etPassword.text.toString()
                        )
                }
                false
            }

            btLogin.setOnClickListener {
                loginViewModel.login(
                    etUsername.text.toString(),
                    etPassword.text.toString()
                )
                loading.isVisible = true
            }
        }
    }

    private fun subscribeUi() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                loginViewModel.uiState.collect { uiState ->
                    when (uiState) {
                        is LoginUiState.Success -> {
                            navigateToHome()
                        }
                        is LoginUiState.Error -> {
                            Log.d("erro", uiState.exception.message ?: "")
                            showLoginFailed(uiState.exception.message ?: "")
                        }
                        else -> {}
                    }
                }
            }
        }
    }

    private fun navigateToHome() {
        startActivity(Intent(this, HomeActivity::class.java))
    }

    private fun updateUiWithUser(successState: LoginUiState.Success) {
        val welcome = getString(R.string.welcome)
        val displayName = successState.successMessage
        Toast.makeText(
            applicationContext,
            "$welcome $displayName",
            Toast.LENGTH_LONG
        ).show()
    }

    private fun showLoginFailed(errorString: String) {
        Toast.makeText(applicationContext, errorString, Toast.LENGTH_SHORT).show()
    }
}