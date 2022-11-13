package com.siscadandroid.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ProfileInformationResponse(
    val profile: Profile,
    val profilesShared: List<SharedProfile>
)

@Serializable
data class Profile(
    val id: String,
    val userId: String
)

@Serializable
data class SharedProfile(
    val studentProfileId: String,
    val userId: String,
    val shared: Boolean
)
