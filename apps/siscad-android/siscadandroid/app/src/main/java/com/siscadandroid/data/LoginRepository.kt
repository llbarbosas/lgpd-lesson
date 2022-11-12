package com.siscadandroid.data

import com.siscadandroid.data.model.LoginResponse
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

/**
 * Class that requests authentication and user information
 * from the remote data source and
 * maintains an in-memory cache of login status and user credentials information.
 */

class LoginRepository @Inject constructor(
    private val dataSource: LoginDataSource,
    private val siscadEncryptedSharedPreferences: SiscadEncryptedSharedPreferences
) {

    // in-memory cache of the loggedInUser object
    var user: LoginResponse? = null
        private set

    val isLoggedIn: Boolean
        get() = user != null

    init {
        siscadEncryptedSharedPreferences.getValue("accessToken")
            ?.let { setLoggedInUser(LoginResponse(it)) }
    }

    fun logout() {
        user = null
        dataSource.logout()
    }

    suspend fun login(username: String, password: String) = flow {
        val result = dataSource.login(username, password)
        if (result is Result.Success) {
            setLoggedInUser(result.data)
        }
        emit(result)
    }

    private fun setLoggedInUser(loggedInUser: LoginResponse) {
        siscadEncryptedSharedPreferences.setValue("accessToken", loggedInUser.accessToken)

        this.user = loggedInUser
    }
}