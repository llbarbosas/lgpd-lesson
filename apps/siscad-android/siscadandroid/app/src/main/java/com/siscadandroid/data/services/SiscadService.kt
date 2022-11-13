package com.siscadandroid.data.services

import com.siscadandroid.data.model.ProfileInformationResponse
import com.siscadandroid.data.model.AccessResponse
import com.siscadandroid.data.model.RequestProfileAccessRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface SiscadService {
    @GET("profiles")
    suspend fun getProfiles(): Response<ProfileInformationResponse>

    @POST("profiles/request_access")
    suspend fun requestAccess(
        @Body requestAccessResponse: RequestProfileAccessRequest
    ): Response<AccessResponse>

    @POST("/profiles/{student_profile_id}/authorize")
    suspend fun authorizeAccess(
        @Header("password") userPassword: String,
        @Path("student_profile_id") currentStudentProfileId: String,
        @Query("user_id") requesterUserId: String,
    ): Response<AccessResponse>
}