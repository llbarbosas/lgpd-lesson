package com.siscadandroid.data

import okhttp3.Interceptor
import okhttp3.Request
import okhttp3.Response
import javax.inject.Inject

class AuthInterceptor @Inject constructor(
    private val siscadEncryptedSharedPreferences: SiscadEncryptedSharedPreferences
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val accessToken = siscadEncryptedSharedPreferences.getValue("accessToken")

        if (accessToken.isNullOrBlank()) return chain.proceed(request)

        return chain.proceed(getAuthenticatedRequest(accessToken, request))
    }

    private fun getAuthenticatedRequest(accessToken: String?, request: Request): Request =
        request.newBuilder()
            .header("Authorization", "Bearer $accessToken")
            .build()
}