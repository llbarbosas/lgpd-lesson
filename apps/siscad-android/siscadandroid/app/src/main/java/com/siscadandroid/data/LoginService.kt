package com.siscadandroid.data

import com.siscadandroid.data.model.LoginRequest
import com.siscadandroid.data.model.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginService {
    @POST("auth/token")
    suspend fun login(
        @Body loginRequest: LoginRequest
    ): Response<LoginResponse>

    @POST("/profiles")
    suspend fun profile(
        @Body loginRequest: LoginRequest
    ): Response<LoginResponse>
}