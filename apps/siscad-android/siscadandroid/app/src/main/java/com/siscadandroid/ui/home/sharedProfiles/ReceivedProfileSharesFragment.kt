package com.siscadandroid.ui.home.sharedProfiles

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.widget.doOnTextChanged
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.siscadandroid.R
import com.siscadandroid.databinding.FragmentProfilesBinding
import com.siscadandroid.ui.home.HomeViewModel
import com.siscadandroid.ui.home.ProfilesListAdapter
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class ReceivedProfileSharesFragment : Fragment() {
    private lateinit var binding: FragmentProfilesBinding
    private val homeViewModel: HomeViewModel by activityViewModels()
    private val profilesListAdapter by lazy { ProfilesListAdapter(requireContext()) }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentProfilesBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupUi()
        subscribeUi()
    }

    private fun setupUi() = with(binding) {
        etUsername.doOnTextChanged { text, _, _, _ ->
            binding.btRequestSharing.isEnabled = !text.isNullOrBlank()
        }
        btRequestSharing.setOnClickListener {
            homeViewModel.requestProfileAccess(etUsername.text.toString())
        }
        rvProfilesList.adapter = profilesListAdapter
        rvProfilesList.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
    }

    private fun subscribeUi() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                homeViewModel.homeUiState.collect { uiState ->
                    if (uiState.accessRequestedMessage != null) {
                        Toast.makeText(
                            requireContext(),
                            uiState.accessRequestedMessage,
                            Toast.LENGTH_LONG
                        ).show()
                        homeViewModel.clearAccessRequestedMessage()
                    }
                    binding.tvTitle.text = getString(
                        R.string.profiles_shared_with_you
                    )
                    profilesListAdapter.submitList(
                        uiState.profileInformationResponse?.profileSharesReceived?.map {
                            it.senderUsername
                        }
                    )
                }
            }
        }
    }

}