package com.siscadandroid.data.model

data class Profile(
    val id: String,
    val userId: String
)

data class SharedProfile(
    val studentProfileId: String,
    val userId: String,
    val shared: Boolean
)

data class ProfileInformationResponse(
    val profile: Profile,
    val profilesShared: SharedProfile
)
