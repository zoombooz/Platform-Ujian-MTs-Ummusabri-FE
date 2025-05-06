import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router";
import { IUjian, ujianFormHeadList, ujianFormKeyList, ujianFormStatus, ujianFormType } from "../models/ujian.type";
import { useDrawer } from "../context/DrawerContext";
import { ujianService } from "../service/ujianService";

const baseUrl = Environment.base_url;

export function UjianCMS() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { openDrawer, closeDrawer } = useDrawer();

  const [ujian, setUjian] = useState<IUjian[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mapelList, setMapelList] = useState<{ name: string; key: string }[]>([]);
  const [pagination, setPagination] = useState<IPaginationNew>( defaultPaginationValueNew );
  const [daftarKelasList, setDaftarKelasList] = useState<{ name: string; key: string }[]>([]);
  const [kelompokUjianList, setKelompokUjianList] = useState<{ name: string; key: string }[]>([]);

  const endpoints = {
    get_kelompok_ujian: "admin/kelompok_ujian",
    get_mapel: "admin/mapel",
    get_daftar_kelas: "admin/daftar_kelas",
  };

  useEffect(() => {
    console.log("Query Params: ", searchParams.get('kelompok_ujian_id'))
    fetchData();
    fetchAdditionalData(endpoints["get_daftar_kelas"], setDaftarKelasList);
    fetchAdditionalData(endpoints["get_mapel"], setMapelList);
    fetchAdditionalData(endpoints["get_kelompok_ujian"], setKelompokUjianList);
  }, []);

  const fetchData = (URL?: string) => {
    setLoading(true);
    const kelompok_ujian_id = searchParams.get('kelompok_ujian_id') ?? undefined;
    ujianService.getUjian(URL, 1, 10, kelompok_ujian_id)
    .then(res => {
      const {data, pagination} = res;
      setUjian(data);
      setPagination(pagination);
    })
    .finally(() => setLoading(false))
  };

  const fetchAdditionalData = (
    endpoint: string,
    setList: React.Dispatch<
      React.SetStateAction<{ name: string; key: string }[]>
    >
  ) => {
    const url = `${baseUrl}${endpoint}?limit=100`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const list = response.data.data.map((el: any) => {
          return {
            name: el.nama,
            key: el.id,
          };
        });
        setList(list);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAdd = () => {
    const addClass = (body: IUjian) => {
      body = {
        ...body,
        id_sekolah: 1,
      };
      ujianService.addUjian(body)
      .then(() => {
        fetchData();
        closeDrawer();
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: err.response.data.error,
        });
      })
    };

    openDrawer({
      width: "500px",
      height: "600px",
      content: (
        <Form<IUjian>
          title="Tambah Ujian"
          headList={ujianFormHeadList}
          keyList={ujianFormKeyList}
          type={ujianFormType}
          selectList={{
            kelompok_id: kelompokUjianList,
            mapel_id: mapelList,
            kelas_id: daftarKelasList,
            status: ujianFormStatus,
          }}
          onSubmit={addClass}
          onCancel={closeDrawer}
        />
      ),
    });
  };

  const handleEdit = (ujian: IUjian) => {
    const editClass = (editedData: IUjian) => {
      ujianService.editUjian(ujian.id, editedData)
      .then(() => {
        fetchData();
        closeDrawer();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: err.response.data.error,
        });
      });
    };

    ujian = {
      ...ujian,
      status: ujian.status.toString(),
    };

    openDrawer({
      width: "500px",
      height: "600px",
      content: (
        <Form<IUjian>
          data={ujian}
          title="Tambah Ujian"
          headList={ujianFormHeadList}
          keyList={ujianFormKeyList}
          type={ujianFormType}
          selectList={{
            kelompok_id: kelompokUjianList,
            mapel_id: mapelList,
            kelas_id: daftarKelasList,
            status: ujianFormStatus,
          }}
          onSubmit={editClass}
          onCancel={closeDrawer}
        />
      ),
    });
  };

  const handleDelete = (ujian: IUjian) => {
    Swal.fire({
      title: "Menghapus Item",
      text: "Apakah anda yakin ingin menghapus item ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        ujianService.deleteUjian(ujian.id)
        .then(() => fetchData())
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

  const openInfo = (ujian: IUjian) => {
    navigate(`/admin/soal/${ujian.id}/${ujian.nama}`);
  };

  return (
    <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
      <Table<IUjian>
        title="Daftar Ujian"
        data={ujian}
        headList={ujianFormHeadList}
        keyList={ujianFormKeyList}
        selectList={{
          kelompok_id: kelompokUjianList,
          mapel_id: mapelList,
          kelas_id: daftarKelasList,
        }}
        pagination={pagination}
        infoAction={true}
        editAction={true}
        deleteAction={true}
        onEditAction={handleEdit}
        onDeleteAction={handleDelete}
        onInfoAction={openInfo}
        onChangePage={fetchData}
        additionalButton={
          <button
            onClick={handleAdd}
            className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all"
          >
            <Icon name="heroicons:plus" shape="outline" />
            <p>Tambah Ujian</p>
          </button>
        }
        loading={loading}
      />
    </div>
  );
}
