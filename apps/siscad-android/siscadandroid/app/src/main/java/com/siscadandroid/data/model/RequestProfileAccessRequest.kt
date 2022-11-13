package com.siscadandroid.data.model

import com.google.gson.annotations.SerializedName
import kotlinx.serialization.Serializable

@Serializable
data class RequestProfileAccessRequest(
    @SerializedName("username")
    val passport: String,
    @SerializedName("usage_intention")
    val usageIntention: String = "Dar uma bisbilhotada"
)