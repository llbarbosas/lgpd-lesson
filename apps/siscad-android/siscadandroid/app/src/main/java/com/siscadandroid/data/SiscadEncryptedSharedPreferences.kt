package com.siscadandroid.data

import android.content.Context
import androidx.core.content.edit
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys

class SiscadEncryptedSharedPreferences(
    val context: Context
) {
    private val keyGenParameterSpec = MasterKeys.AES256_GCM_SPEC
    private val masterKeyAlias = MasterKeys.getOrCreate(keyGenParameterSpec)
    private val sharedPreferences = EncryptedSharedPreferences.create(
        "tokens",
        masterKeyAlias,
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun getValue(key: String): String? {
        return sharedPreferences.getString(key, null)
    }

    fun setValue(key: String, value: String?) {
        sharedPreferences.edit(commit = true) {
            putString(key, value)
        }
    }
}