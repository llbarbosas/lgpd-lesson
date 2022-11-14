package com.siscadandroid.data

import com.siscadandroid.data.model.LoginRequest
import com.siscadandroid.data.model.LoginResponse
import com.siscadandroid.data.services.PassportService
import java.io.IOException
import javax.inject.Inject

/**
 * Class that handles authentication w/ login credentials and retrieves user information.
 */
class PassportDataSource @Inject constructor(
    private val passportService: PassportService
) {

    suspend fun login(username: String, password: String): Result<LoginResponse> {
        return try {
            val response = passportService.login(
                LoginRequest(
                    username = username,
                    password = password
                )
            ).body() ?: throw Throwable()
            Result.Success(response)
        } catch (e: Throwable) {
            Result.Error(IOException("Error logging in", e))
        }
    }

    fun logout() {
        // TODO: revoke authentication
    }
}