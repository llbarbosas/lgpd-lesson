package com.siscadandroid.di

import android.content.Context
import com.siscadandroid.BuildConfig
import com.siscadandroid.data.AuthInterceptor
import com.siscadandroid.data.LoginDataSource
import com.siscadandroid.data.LoginRepository
import com.siscadandroid.data.LoginService
import com.siscadandroid.data.SiscadEncryptedSharedPreferences
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


@Module
@InstallIn(SingletonComponent::class)
object SiscadModule {
    @Provides
    fun provideLoginRepository(
        dataSource: LoginDataSource,
        siscadEncryptedSharedPreferences: SiscadEncryptedSharedPreferences
    ): LoginRepository {
        return LoginRepository(dataSource, siscadEncryptedSharedPreferences)
    }

    @Provides
    fun provideSiscadEncryptedSharedPreferences(
        @ApplicationContext context: Context
    ): SiscadEncryptedSharedPreferences {
        return SiscadEncryptedSharedPreferences(context = context)
    }

    @Provides
    fun provideLoginDataSource(
        loginService: LoginService
    ): LoginDataSource {
        return LoginDataSource(loginService)
    }

    @Provides
    fun providerAuthInterceptor(
        sharedPreferences: SiscadEncryptedSharedPreferences
    ): AuthInterceptor {
        return AuthInterceptor(
            siscadEncryptedSharedPreferences = sharedPreferences
        )
    }

    @Provides
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor
    ): OkHttpClient {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)
        return OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor(authInterceptor)
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
