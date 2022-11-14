package com.siscadandroid.data.repositories

import com.siscadandroid.data.Result
import com.siscadandroid.data.SiscadDataSource
import com.siscadandroid.data.model.AccessResponse
import com.siscadandroid.data.model.ProfileInformationResponse
import com.siscadandroid.data.model.RequestProfileAccessRequest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class SiscadRepository @Inject constructor(
    private val dataSource: SiscadDataSource
) {
    suspend fun getProfiles(): Flow<Result<ProfileInformationResponse>> = flow {
        emit(dataSource.getProfiles())
    }

    suspend fun requestAccess(senderUserName: String): Flow<Result<AccessResponse>> = flow {
        emit(
            dataSource.requestAccess(
                requestProfileAccessRequest = RequestProfileAccessRequest(
                    userName = senderUserName
                )
            )
        )
    }

    suspend fun authorizeAccess(
        password: String,
        requesterUserId: String,
        currentStudentProfileId: String
    ): Flow<Result<AccessResponse>> = flow {
        emit(
            dataSource.authorizeAccess(
                password = password,
                requesterUserId = requesterUserId,
                currentStudentProfileId = currentStudentProfileId
            )
        )
    }
}