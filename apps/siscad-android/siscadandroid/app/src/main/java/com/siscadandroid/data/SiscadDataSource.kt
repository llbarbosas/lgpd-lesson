package com.siscadandroid.data

import com.siscadandroid.data.model.AccessResponse
import com.siscadandroid.data.model.ProfileInformationResponse
import com.siscadandroid.data.model.RequestProfileAccessRequest
import com.siscadandroid.data.services.SiscadService
import java.io.IOException
import javax.inject.Inject

class SiscadDataSource @Inject constructor(
    private val siscadService: SiscadService
) {

    suspend fun getProfiles(): Result<ProfileInformationResponse> {
        return try {
            val response = siscadService.getProfiles().body() ?: throw Throwable()
            Result.Success(response)
        } catch (e: java.lang.Exception) {
            Result.Error(IOException("Error getting profiles", e))
        }
    }

    suspend fun requestAccess(
        requestProfileAccessRequest: RequestProfileAccessRequest
    ): Result<AccessResponse> {
        return try {
            siscadService.requestAccess(requestProfileAccessRequest).body()?.let {
                Result.Success(it)
            } ?: Result.Error(IOException("Error getting profiles"))
        } catch (e: Exception) {
            Result.Error(IOException("Error getting profiles", e))
        }
    }

    suspend fun authorizeAccess(
        password: String,
        requesterUserId: String,
        currentStudentProfileId: String
    ): Result<AccessResponse> {
        return try {
            siscadService.authorizeAccess(
                userPassword = password,
                currentStudentProfileId = currentStudentProfileId,
                requesterUserId = requesterUserId,
            ).body()?.let {
                Result.Success(it)
            } ?: Result.Error(IOException("Error sharing profile"))
        } catch (e: Exception) {
            Result.Error(IOException("Error sharing profile", e))
        }
    }

}