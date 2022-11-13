package com.siscadandroid.di

import android.content.Context
import com.siscadandroid.BuildConfig
import com.siscadandroid.data.AuthInterceptor
import com.siscadandroid.data.PassportDataSource
import com.siscadandroid.data.SiscadDataSource
import com.siscadandroid.data.SiscadEncryptedSharedPreferences
import com.siscadandroid.data.repositories.PassportRepository
import com.siscadandroid.data.repositories.SiscadRepository
import com.siscadandroid.data.services.PassportService
import com.siscadandroid.data.services.SiscadService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Qualifier


@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Qualifier
    @Retention(AnnotationRetention.BINARY)
    annotation class PassportRetrofit

    @Qualifier
    @Retention(AnnotationRetention.BINARY)
    annotation class SiscadRetrofit

    @Qualifier
    @Retention(AnnotationRetention.BINARY)
    annotation class PassportOkHttp

    @Qualifier
    @Retention(AnnotationRetention.BINARY)
    annotation class SiscadOkHttp

    @Provides
    fun provideEncryptedSharedPreferences(
        @ApplicationContext context: Context
    ): SiscadEncryptedSharedPreferences {
        return SiscadEncryptedSharedPreferences(context = context)
    }

    @Provides
    fun provideSiscadRepository(
        dataSource: SiscadDataSource
    ): SiscadRepository {
        return SiscadRepository(dataSource)
    }

    @Provides
    fun providePassportRepository(
        dataSource: PassportDataSource,
        siscadEncryptedSharedPreferences: SiscadEncryptedSharedPreferences
    ): PassportRepository {
        return PassportRepository(dataSource, siscadEncryptedSharedPreferences)
    }

    @Provides
    fun providePassportDataSource(
        passportService: PassportService
    ): PassportDataSource {
        return PassportDataSource(passportService)
    }

    @Provides
    fun provideSiscadDataSource(
        siscadService: SiscadService
    ): SiscadDataSource {
        return SiscadDataSource(siscadService)
    }

    @Provides
    fun providerAuthInterceptor(
        sharedPreferences: SiscadEncryptedSharedPreferences
    ): AuthInterceptor {
        return AuthInterceptor(
            siscadEncryptedSharedPreferences = sharedPreferences
        )
    }

    @SiscadOkHttp
    @Provides
    fun provideSiscadOkHttpClient(
        authInterceptor: AuthInterceptor
    ): OkHttpClient {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)
        return OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor(authInterceptor)
            .build()
    }

    @PassportOkHttp
    @Provides
    fun providePassportOkHttpClient(): OkHttpClient {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)
        return OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()
    }

    @Provides
    @PassportRetrofit
    fun providePassportRetrofit(
        @PassportOkHttp okHttpClient: OkHttpClient
    ): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.PASSPORT_API_BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(okHttpClient)
        .build()


    @Provides
    @SiscadRetrofit
    fun provideSiscadRetrofit(
        @SiscadOkHttp okHttpClient: OkHttpClient
    ): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.SISCAD_API_BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(okHttpClient)
        .build()


    @Provides
    fun providePassportService(
        @PassportRetrofit retrofit: Retrofit
    ): PassportService {
        return retrofit.create(PassportService::class.java)
    }

    @Provides
    fun provideSiscadService(
        @SiscadRetrofit retrofit: Retrofit
    ): SiscadService {
        return retrofit.create(SiscadService::class.java)
    }
}
