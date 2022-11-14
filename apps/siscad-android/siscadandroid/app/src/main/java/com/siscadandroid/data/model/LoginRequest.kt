package com.siscadandroid.data.model

import com.siscadandroid.BuildConfig
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val grant_type: String = "password",
    val client_id: String = BuildConfig.CLIENT_ID,
    val client_secret: String = BuildConfig.CLIENT_SECRET,
    val username: String,
    val password: String,
    val scope: String = "passport student.profile:share",
)