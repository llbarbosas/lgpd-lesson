package com.siscadandroid.ui.home.sharesSent

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.LinearLayoutManager
import com.siscadandroid.R
import com.siscadandroid.databinding.FragmentProfileSharedWithBinding
import com.siscadandroid.ui.home.HomeViewModel
import com.siscadandroid.ui.home.ProfileRequestModel
import com.siscadandroid.ui.home.ProfileRequestsListAdapter
import com.siscadandroid.ui.home.ProfilesListAdapter
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class ProfileSharesSentFragment : Fragment() {
    private lateinit var binding: FragmentProfileSharedWithBinding
    private val homeViewModel: HomeViewModel by activityViewModels()
    private val profilesListAdapter by lazy { ProfilesListAdapter(requireContext()) }
    private val requestsListAdapter by lazy { ProfileRequestsListAdapter(requireContext()) }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentProfileSharedWithBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupUi()
        subscribeUi()
    }

    private fun setupUi() = with(binding) {
        rvProfileRequestedList.adapter = requestsListAdapter
        rvProfileRequestedList.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
        rvSharedList.adapter = profilesListAdapter
        rvSharedList.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
        tvTitle.text = getString(R.string.profile_shares_sent)
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
                    requestsListAdapter.submitList(
                        //TODO(Usar array profileSharedWith)
                        uiState.profileInformationResponse?.profilesShared?.filter { !it.shared }
                            ?.map {
                                ProfileRequestModel(
                                    approveRequestAction = {
                                        homeViewModel.authorizeProfileAccess(
                                            requesterUserId = it.userId
                                        )
                                    },
                                    userId = it.userId,
                                    //TODO(trocar studentProfileId por passport)
                                    userPassport = it.studentProfileId
                                )
                            }
                    )
                    profilesListAdapter.submitList(
                        uiState.profileInformationResponse?.profilesShared?.filter { it.shared }
                            ?.map { it.studentProfileId }
                    )
                }
            }
        }
    }

}