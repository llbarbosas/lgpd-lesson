package com.siscadandroid.data.model

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val grant_type: String = "password",
    val client_id: String = "746f9e8e-433a-4df0-8776-765e1681f5d3",
    val client_secret: String = "123456",
    val username: String,
    val password: String,
    val scope: String = "passport student.profile:share",
)