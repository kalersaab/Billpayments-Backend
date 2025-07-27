import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  Modal,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import FloatingActionButton from "@/components/float";
import {
  usecreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/category/mutation";
import { useGetCategory } from "@/hooks/category/query";
import useTranslation from "@/hooks/useTranslation";
import { useAtom } from "jotai";
import { cat } from "@/store";

type Category = {
  _id: string;
  name: string;
};

const { height, width } = Dimensions.get("window");

const CategoryItem = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState<any>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const createCategory: any = usecreateCategory();
  const deleteCategory: any = useDeleteCategory();
  const editCategory: any = useUpdateCategory();
  const [categories, setCategories] = useAtom(cat);
  const { data, refetch, isFetching, error } = useGetCategory({});

  React.useEffect(() => {
    if (data?.pages) {
      const categories =
        data?.pages?.reduce(
          (acc: any, obj: any) => acc.concat(obj?.data.data),
          []
        ) || [];
      setCategories(categories);
    }
  }, [data, setCategories]);
  if (isFetching && categories.length === 0) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading categories</Text>;
  }
  const openModalForAdd = () => {
    setCurrentCategory(null);
    setCategoryName("");
    setIsEditMode(false);
    setModalVisible(true);
  };

  const openModalForEdit = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      ToastAndroid.show("Category name cannot be empty", ToastAndroid.SHORT);
      return;
    }
    if (currentCategory) {
      editCategory
        .mutateAsync({
          categoryId: currentCategory?._id,
          body: { name: categoryName },
        })
        .then(() => {
          refetch();
          setCategoryName("");
          ToastAndroid.show(t("category.saveSuccess"), ToastAndroid.SHORT);
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.log("err", err);
          ToastAndroid.show("Failed to update category", ToastAndroid.SHORT);
        });
    } else {
      createCategory
        .mutateAsync({ body: { name: categoryName } })
        .then(() => {
          refetch();
          setCategoryName("");
          ToastAndroid.show(
            ` ${
              isEditMode
                ? t("category.editCategory")
                : t("category.addCategoryToast")
            }`,
            ToastAndroid.SHORT
          );
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.log("err", err);
          ToastAndroid.show("Failed to add category", ToastAndroid.SHORT);
        });
      setIsLoading(false);
    }
    closeModal();
  };

  const handleDelete = async (categoryId: string) => {
    try {
      deleteCategory
        .mutateAsync({ categoryId })
        .then(() => {
          ToastAndroid.show(t("category.deleteSuccess"), ToastAndroid.SHORT);
          refetch();
        })
        .catch((err: any) => {
          console.log("err", err);
        });
    } catch (error) {
      ToastAndroid.show("Failed to delete category", ToastAndroid.SHORT);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{item.name}</Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openModalForEdit(item)}
          onLongPress={() =>
            ToastAndroid.show(t("category.editCategory"), ToastAndroid.SHORT)
          }
        >
          <Feather name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
          onLongPress={() =>
            ToastAndroid.show(t("category.deleteCategory"), ToastAndroid.SHORT)
          }
        >
          <MaterialIcons name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={require("@/assets/images/no_data.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>{t("category.notFound")}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={
          categories.length === 0 && styles.emptyListContent
        }
        ListEmptyComponent={renderEmptyState}
      />

      <FloatingActionButton
        onPress={openModalForAdd}
        onLongPress={() =>
          ToastAndroid.show(t("category.addCategoryToast"), ToastAndroid.SHORT)
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isEditMode
                ? t("category.editCategory")
                : t("category.addCategory")}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={t("category.name")}
              placeholderTextColor="#ccc"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={closeModal}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => handleSave()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isEditMode ? t("edit") : t("save")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgb(39, 39, 39)",
  },
  container: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryContainer: {
    flex: 2,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: "rgb(75,75,75)",
    justifyContent: "center",
    paddingVertical: 15,
  },
  categoryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  actionContainer: {
    flex: 1,
    flexDirection: "column",
  },
  editButton: {
    backgroundColor: "#2ecc71",
    width: width * 0.3,
    borderTopRightRadius: 10,
    alignItems: "center",
    paddingVertical: 20,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 20,
    width: width * 0.3,
    borderBottomRightRadius: 10,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  emptyImage: {
    width: width * 0.8,
    height: 300,
    resizeMode: "contain",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    padding: 25,
    backgroundColor: "#333",
    borderRadius: 15,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#444",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  saveButton: {
    backgroundColor: "#2ecc71",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CategoryItem;
