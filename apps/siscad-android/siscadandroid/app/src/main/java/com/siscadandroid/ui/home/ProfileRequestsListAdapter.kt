package com.siscadandroid.ui.home

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import com.siscadandroid.databinding.ItemProfileRequestBinding

data class ProfileRequestModel(
    val approveRequestAction: () -> Unit,
    val userId: String,
    val userPassport: String
)

class ProfileRequestsListAdapter(
    private val context: Context
) : ListAdapter<ProfileRequestModel, ProfileRequestViewHolder>(CallbackUtil) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProfileRequestViewHolder {
        val binding = ItemProfileRequestBinding.inflate(LayoutInflater.from(context), parent, false)
        return ProfileRequestViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProfileRequestViewHolder, position: Int) {
        holder.bind(currentList[position])
    }

    object CallbackUtil : DiffUtil.ItemCallback<ProfileRequestModel>() {
        override fun areItemsTheSame(oldItem: ProfileRequestModel, newItem: ProfileRequestModel): Boolean {
            return oldItem == newItem
        }

        override fun areContentsTheSame(oldItem: ProfileRequestModel, newItem: ProfileRequestModel): Boolean {
            return oldItem == newItem

        }

    }
}