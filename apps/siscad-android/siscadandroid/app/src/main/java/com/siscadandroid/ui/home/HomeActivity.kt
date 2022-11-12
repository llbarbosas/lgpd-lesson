package com.siscadandroid.ui.home

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.siscadandroid.R
import com.siscadandroid.databinding.ActivityHomeBinding
import com.siscadandroid.ui.home.sharedProfiles.ReceivedProfileSharesFragment
import com.siscadandroid.ui.home.sharesSent.ProfileSharesSentFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class HomeActivity : AppCompatActivity() {
    private lateinit var binding: ActivityHomeBinding

    private val homeViewModel: HomeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupUi()
    }

    private fun setupUi() {
        binding.bottomAppBar.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.usersSharedProfiles -> {
                    showUsersShareProfilesFragment()
                    true
                }
                R.id.usersISharedMyProfile -> {
                    showProfileSharesSentFragment()
                    true
                }
                else -> {
                    false
                }
            }
        }
        binding.bottomAppBar.selectedItemId = R.id.usersSharedProfiles
    }

    private fun showUsersShareProfilesFragment() {
        supportFragmentManager
            .beginTransaction()
            .replace(R.id.fragmentContainer, ReceivedProfileSharesFragment())
            .commit()
    }

    private fun showProfileSharesSentFragment() {
        supportFragmentManager
            .beginTransaction()
            .replace(R.id.fragmentContainer, ProfileSharesSentFragment())
            .commit()
    }
}