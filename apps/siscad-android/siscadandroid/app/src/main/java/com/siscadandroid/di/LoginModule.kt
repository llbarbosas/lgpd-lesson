package com.siscadandroid.di

import com.siscadandroid.data.LoginDataSource
import com.siscadandroid.data.LoginRepository
import com.siscadandroid.data.LoginService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit

@Module
@InstallIn(SingletonComponent::class)
object LoginModule {
    @Provides
    fun provideLoginRepository(
        dataSource: LoginDataSource
    ): LoginRepository {
        return LoginRepository(dataSource)
    }

    @Provides
    fun provideLoginDataSource(
        loginService: LoginService
    ): LoginDataSource {
        return LoginDataSource(loginService)
    }

    @Provides
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://localhost/auth/authorize/")
        .build()

    @Provides
    fun provideLoginService(retrofit: Retrofit): LoginService {
        return retrofit.create(LoginService::class.java)
    }
}
