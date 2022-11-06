package com.siscadandroid.data

import kotlinx.serialization.Serializable
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginService {
    @POST("/auth/authorize")
    suspend fun login(
        @Body loginRequest: LoginRequest
    ): Response<LoginResponse>
}

@Serializable
data class LoginResponse(
    val accessToken: String
)

data class LoginRequest(
    val passport: String,
    val password: String
)