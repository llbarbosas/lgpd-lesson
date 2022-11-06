package com.siscadandroid.ui.home

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.siscadandroid.R
import com.siscadandroid.databinding.ActivityHomeBinding
import com.siscadandroid.ui.home.sharedProfiles.UsersSharedProfilesFragment
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
                    Toast.makeText(this, "Clicked usersISharedMyProfile", Toast.LENGTH_LONG).show()
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
            .add(R.id.fragmentContainer, UsersSharedProfilesFragment())
            .commit()
    }
}