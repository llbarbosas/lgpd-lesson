package com.siscadandroid.ui.home.sharedProfiles

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import com.siscadandroid.databinding.ItemSharedProfileBinding

class SharedProfilesAdapter(
    private val context: Context
) : ListAdapter<String, SharedProfileViewHolder>(CallbackUtil) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SharedProfileViewHolder {
        val binding = ItemSharedProfileBinding.inflate(LayoutInflater.from(context), parent, false)
        return SharedProfileViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SharedProfileViewHolder, position: Int) {
        holder.bind(currentList[position])
    }

    object CallbackUtil : DiffUtil.ItemCallback<String>() {
        override fun areItemsTheSame(oldItem: String, newItem: String): Boolean {
            return oldItem == newItem
        }

        override fun areContentsTheSame(oldItem: String, newItem: String): Boolean {
            return oldItem == newItem

        }

    }
}