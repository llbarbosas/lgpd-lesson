package com.siscadandroid.ui.home

import androidx.recyclerview.widget.RecyclerView
import com.siscadandroid.databinding.ItemProfileRequestBinding

class ProfileRequestViewHolder(
    private val binding: ItemProfileRequestBinding
) : RecyclerView.ViewHolder(binding.root) {
    fun bind(requestModel: ProfileRequestModel) {
        with(binding) {
            btUserPassport.text = requestModel.userPassport
            btApproveRequest.setOnClickListener {
                requestModel.approveRequestAction()
            }
        }
    }
}