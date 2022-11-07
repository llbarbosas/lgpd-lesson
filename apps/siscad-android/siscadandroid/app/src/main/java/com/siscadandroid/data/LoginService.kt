package com.siscadandroid.data

import kotlinx.serialization.Serializable
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginService {
    @POST("auth/token")
    suspend fun login(
        @Body loginRequest: LoginRequest
    ): Response<LoginResponse>
}

@Serializable
data class LoginResponse(
    val accessToken: String
)

@Serializable
data class LoginRequest(
    val grant_type: String = "password",
    val client_id: String = "746f9e8e-433a-4df0-8776-765e1681f5d3",
    val client_secret: String = "123456",
    val username: String,
    val password: String,
    val scope: String = "passport student.profile:share",
)