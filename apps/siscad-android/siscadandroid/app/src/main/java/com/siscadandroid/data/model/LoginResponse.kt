package com.siscadandroid.data.model

import com.google.gson.annotations.SerializedName
import kotlinx.serialization.Serializable

@Serializable
data class LoginResponse(
    @SerializedName("access_token")
    val accessToken: String
)