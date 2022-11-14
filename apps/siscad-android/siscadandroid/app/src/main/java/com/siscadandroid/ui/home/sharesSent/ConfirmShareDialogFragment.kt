package com.siscadandroid.ui.home.sharesSent

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.activityViewModels
import com.siscadandroid.databinding.ConfirmShareDialogBinding
import com.siscadandroid.ui.home.HomeViewModel

class ConfirmShareDialogFragment : DialogFragment() {
    private var _binding: ConfirmShareDialogBinding? = null
    private val binding get() = _binding!!
    private val homeViewModel: HomeViewModel by activityViewModels()

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val receiverId = arguments?.getString("receiverId")!!

        _binding = ConfirmShareDialogBinding.inflate(layoutInflater)
        binding.btConfirmShare.setOnClickListener {
            homeViewModel.authorizeProfileAccess(
                requesterUserId = receiverId,
                password = binding.etPassword.text.toString()
            )
            dismiss()
        }
        return AlertDialog.Builder(activity).setView(binding.root).create()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        fun newInstance(receiverId: String): ConfirmShareDialogFragment {
            return ConfirmShareDialogFragment().apply {
                val args = Bundle()
                args.putString("receiverId", receiverId)
                arguments = args
            }
        }
    }
}