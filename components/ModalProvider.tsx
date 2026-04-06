"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, ModalProps } from "./Modal";

interface ModalContextType {
  showModal: (props: Omit<ModalProps, "isOpen" | "onClose">) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalProps, setModalProps] = useState<Omit<
    ModalProps,
    "isOpen" | "onClose"
  > | null>(null);

  const showModal = (props: Omit<ModalProps, "isOpen" | "onClose">) => {
    setModalProps(props);
  };

  const hideModal = () => {
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        {...(modalProps as ModalProps)}
        isOpen={modalProps !== null}
        onClose={hideModal}
      />
    </ModalContext.Provider>
  );
}
