"use client";
import { Modal } from "@/components/shared/modal";
import WorkspaceForm from "@/components/forms/workspace-form";
import { useCreateWorkspaceModal } from "@/hooks/use-modals";
import { useGetWorkspaces } from "@/hooks/use-workspaces";
import React, { useEffect, useState } from "react";

function InitialWorkspaceModal() {
  const createWorkspaceModal = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to manage when the modal should open
  useEffect(() => {
    if (!isLoading && data?.length === 0) {
      setIsModalOpen(true);
    }
  }, [data, isLoading]);

  // Handle closing the modal
  const onClose = () => {
    setIsModalOpen(false); // Allow closing manually
    createWorkspaceModal.onClose();
  };

  // Check if it should reopen
  useEffect(() => {
    if (!isLoading && data?.length === 0 && !isModalOpen) {
      setIsModalOpen(true);
    }
  }, [data, isLoading, isModalOpen]);

  if (isLoading) return null;

  return (
    <Modal
      title="Create your first workspace"
      description="Let's get started by creating your first workspace."
      isOpen={isModalOpen}
      onClose={onClose}
    >
      <WorkspaceForm mode="create" />
    </Modal>
  );
}

export default InitialWorkspaceModal;
