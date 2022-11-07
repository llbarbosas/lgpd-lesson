package com.siscadandroid.di

import com.siscadandroid.BuildConfig
import com.siscadandroid.data.LoginDataSource
import com.siscadandroid.data.LoginRepository
import com.siscadandroid.data.LoginService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


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
    fun provideOkHttpClient(): OkHttpClient {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)
        return OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()
    }

    @Provides
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(okHttpClient)
        .build()


    @Provides
    fun provideLoginService(retrofit: Retrofit): LoginService {
        return retrofit.create(LoginService::class.java)
    }
}
