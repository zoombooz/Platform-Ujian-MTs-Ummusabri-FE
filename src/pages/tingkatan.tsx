import { useEffect, useState } from "react";
import { Icon } from "../components/icon";
import { Table } from "../components/table";
import {
  defaultPaginationValueNew,
  IPaginationNew,
} from "../models/table.type";
import { Form } from "../components/form";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { useDrawer } from "../context/DrawerContext";
// import { getTokenPayload, isRoleAdmin } from "../utils/jwt";
export interface ITingkatan {
  id: string;
  nama: string;
  created_at: string;
  updated_at: string;
}

export function Tingkatan() {
  const baseUrl = Environment.base_url;
  const [loading, setLoading] = useState<boolean>(false);
  const { openDrawer, closeDrawer } = useDrawer();
  const [pagination, setPagination] = useState<IPaginationNew>(
    defaultPaginationValueNew
  );
  const [jurusan, setJurusan] = useState<ITingkatan[]>([]);

  const endpoints = {
    create: `admin/tingkatan`,
    get: `admin/tingkatan`,
    edit: (id: string) => `admin/tingkatan/${id}`,
    delete: (id: string) => `admin/tingkatan/${id}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (URL?: string) => {
    setLoading(true);
    const url = URL ?? `${baseUrl}${endpoints["get"]}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((result) => {
        const { data, pagination } = (({ data, ...pagination }) => {
          return { data, pagination };
        })(result.data);
        setJurusan(data);
        setPagination(pagination);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    const addJurusan = async (body: Partial<ITingkatan>) => {
      const url = `${baseUrl}${endpoints["create"]}`;
      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then(() => {
          fetchData();
          closeDrawer();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Request Failed",
            text: `${(error as Error).message}`,
          });
        });
    };

    openDrawer({
      width: "500px",
      height: "240px",
      content: (
        <Form<ITingkatan>
          title="Tambah Tingkatan"
          headList={["Nama Tingkatan"]}
          keyList={["nama"]}
          type={["text"]}
          onSubmit={addJurusan}
          onCancel={closeDrawer}
        />
      ),
    });
  };

  const handleEdit = (jurusan: ITingkatan) => {
    const editJurusan = async (body: Partial<ITingkatan>) => {
      const url = `${baseUrl}${endpoints["edit"](jurusan.id)}`;
      await axios
        .put(url, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then(() => {
          fetchData();
          closeDrawer();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Request Failed",
            text: `${(error as Error).message}`,
          });
        });
    };

    openDrawer({
      width: "500px",
      height: "240px",
      content: (
        <Form<ITingkatan>
          data={jurusan}
          title="Edit Tingkatan"
          headList={["Nama Tingkatan"]}
          keyList={["nama"]}
          type={["text"]}
          onSubmit={editJurusan}
          onCancel={closeDrawer}
        />
      ),
    });
  };

  const handleDelete = (jurusan: ITingkatan) => {
    Swal.fire({
      title: "Menghapus Item",
      text: "Apakah anda yakin ingin menghapus item ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${baseUrl}${endpoints["delete"](jurusan.id)}`;
        axios
          .delete(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          .then(() => {
            fetchData();
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Request Failed",
              text: `${(error as Error).message}`,
            });
          });
      }
    });
  };

  return (
    <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
      <Table<ITingkatan>
        title="Tingkatan"
        data={jurusan}
        headList={["Id", "Nama Tingkatan"]}
        keyList={["id", "nama"]}
        pagination={pagination}
        numberRow={false}
        editAction={true}
        deleteAction={true}
        additionalButton={
          <div className="flex gap-1">
            <button
              onClick={handleAdd}
              className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all"
            >
              <Icon name="heroicons:plus" shape="outline" />
              <p>Tambah Tingkatan</p>
            </button>
          </div>
        }
        onEditAction={handleEdit}
        onDeleteAction={handleDelete}
        onChangePage={fetchData}
        loading={loading}
      />
    </div>
  );
}
