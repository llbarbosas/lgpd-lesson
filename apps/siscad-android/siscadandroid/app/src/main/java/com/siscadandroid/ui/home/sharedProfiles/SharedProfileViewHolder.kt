package com.siscadandroid.ui.home.sharedProfiles

import androidx.recyclerview.widget.RecyclerView
import com.siscadandroid.databinding.ItemSharedProfileBinding

class SharedProfileViewHolder(
    val binding: ItemSharedProfileBinding
): RecyclerView.ViewHolder(binding.root) {
    fun bind(profileName: String){
        binding.btProfile.text = profileName
    }
}