import Loading from "@/app/components/Loading/Loading";
import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const SystemUniversity = ({
  id,
  name,
  fetchData,
}: {
  id: string;
  name: string;
  fetchData: () => void;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openEditModal = (item: string) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const closeEditModal = () => setIsEditModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    const apiUrl = `${getApiUrl("/admin/university")}/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la suppression de l&apos;Université"
        );
      }

      toast.success("Université supprimée avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression");
        console.error(error); // Utilisation simple
    } finally {
      setIsLoading(false);
      fetchData();
      closeDeleteModal();
    }
  };

  const handleUpdate = async (id: string, newName: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    if (!newName) {
      toast.error("Veuillez renseigner le nom de l'université.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${getApiUrl("/admin/university")}/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour de l&apos;université"
        );
      }

      toast.success("Université modifiée avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la modification");
        console.error(error); // Utilisation simple
    } finally {
      setIsLoading(false);
      fetchData();
      closeEditModal();
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <Toaster richColors position="top-right" />

          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-8">
              <button
                onClick={() => openEditModal(newName)}
                title="Modifier l'université"
                aria-label="Modifier l'université"
              >
                <Image
                  src="/assets/icons/editer.png"
                  alt="Modifier"
                  height={20}
                  width={20}
                />
              </button>
              <button
                onClick={openDeleteModal}
                title="Supprimer l'université"
                aria-label="Supprimer l'université"
              >
                <Image
                  src="/assets/icons/supprimer.png"
                  alt="Supprimer"
                  height={20}
                  width={20}
                />
              </button>
            </div>
          </div>

          {/* Modale d'édition */}
          {isEditModalOpen && (
            <div
              onClick={closeEditModal}
              className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-800 pb-4">
                  Éditer l&apos;élément : {itemToEdit}
                </h3>
                <input
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  className="w-full p-4 border"
                  placeholder={`Modifier ${itemToEdit}`}
                  value={newName}
                />
                <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                  <button
                    onClick={closeEditModal}
                    className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                    type="button"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleUpdate(id, newName)}
                    className="rounded-md btn btn-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700"
                    type="button"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modale de suppression */}
          {isDeleteModalOpen && (
            <div
              onClick={closeDeleteModal}
              className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-800 pb-4">
                  Êtes-vous sûr de vouloir supprimer cet élément ?
                </h3>
                <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                  <button
                    onClick={closeDeleteModal}
                    className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                    type="button"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700"
                    type="button"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemUniversity;
