package com.siscadandroid.data

import java.io.IOException
import javax.inject.Inject

/**
 * Class that handles authentication w/ login credentials and retrieves user information.
 */
class LoginDataSource @Inject constructor(
    private val loginService: LoginService
) {

    suspend fun login(passport: String, password: String): Result<LoginResponse> {
        return try {
            val response = loginService.login(
                LoginRequest(passport = passport, password = password)
            ).body() ?: throw Throwable()
            Result.Success(
                response
            )
        } catch (e: Throwable) {
            Result.Error(IOException("Error logging in", e))
        }
    }

    fun logout() {
        // TODO: revoke authentication
    }
}