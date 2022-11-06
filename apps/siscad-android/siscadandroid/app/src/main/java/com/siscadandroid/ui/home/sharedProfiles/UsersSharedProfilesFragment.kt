package com.siscadandroid.ui.home.sharedProfiles

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.siscadandroid.R
import com.siscadandroid.databinding.FragmentUsersSharedProfilesBinding
import com.siscadandroid.ui.home.HomeViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class UsersSharedProfilesFragment : Fragment() {
    private lateinit var binding: FragmentUsersSharedProfilesBinding
    private val homeViewModel: HomeViewModel by activityViewModels()
    private val sharedProfilesAdapter by lazy { SharedProfilesAdapter(requireContext()) }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentUsersSharedProfilesBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupUi()
        subscribeUi()
    }

    private fun setupUi() = with(binding) {
        rvSharedProfilesList.adapter = sharedProfilesAdapter
        rvSharedProfilesList.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
    }

    private fun subscribeUi() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                homeViewModel.homeUiState.collect { uiState ->
                    binding.tvTitle.text = getString(
                        R.string.users_shared_profiles_count
                    )
                    sharedProfilesAdapter.submitList(uiState.usersSharedProfilesList)
                }
            }
        }
    }

}