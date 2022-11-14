package com.siscadandroid.data.model

import com.google.gson.annotations.SerializedName
import kotlinx.serialization.Serializable

@Serializable
data class ProfileInformationResponse(
    val profile: Profile? = null,
    val profileSharesSent: List<ProfileShareInformation>,
    val profileSharesReceived: List<ProfileShareInformation>,
)

@Serializable
data class Profile(
    val id: String,
    val userId: String? = null
)

@Serializable
data class ProfileShareInformation(
    val studentProfileId: String,
    val senderId: String,
    val senderUsername: String,
    val receiverId: String,
    val receiverUsername: String,
    val status: ShareStatus
)

enum class ShareStatus {
    @SerializedName("requested")
    REQUESTED,
    @SerializedName("authorized")
    AUTHORIZED,
}
