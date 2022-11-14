package com.siscadandroid.ui.home

import androidx.recyclerview.widget.RecyclerView
import com.siscadandroid.databinding.ListItemProfileBinding

class ProfileViewHolder(
    val binding: ListItemProfileBinding
): RecyclerView.ViewHolder(binding.root) {
    fun bind(profileName: String){
        binding.btProfile.text = profileName
    }
}