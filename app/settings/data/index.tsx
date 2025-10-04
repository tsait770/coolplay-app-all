import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Shield, Clock, Upload, Download, RotateCcw, HardDrive, ChevronRight } from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import Colors from "@/constants/colors";
import { useStorage } from "@/providers/StorageProvider";

export default function DataManagementSettings() {
  const { t } = useTranslation();
  const storage = useStorage();
  
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(true);
  const [backupFrequency] = useState<string>("daily");
  const [cacheSize, setCacheSize] = useState<string>("128 MB");
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [lastBackupDate] = useState<string>("2024年1月15日 14:30");

  const handleAutoBackupToggle = async (value: boolean) => {
    setAutoBackupEnabled(value);
    try {
      await storage.setItem("auto_backup_enabled", value ? "true" : "false");
    } catch (error) {
      console.error("Failed to save auto backup setting:", error);
    }
  };

  const handleBackupNow = () => {
    Alert.alert(
      t("backup_now"),
      t("backup_in_progress"),
      [{ text: t("ok") }]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      t("export_data"),
      t("export_data_description"),
      [
        { text: t("cancel"), style: "cancel" },
        { text: t("export"), onPress: () => console.log("Exporting data...") },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      t("import_data"),
      t("import_data_description"),
      [
        { text: t("cancel"), style: "cancel" },
        { text: t("import"), onPress: () => console.log("Importing data...") },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      t("clear_cache"),
      t("clear_cache_confirm"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("clear"),
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              await storage.clear();
              setCacheSize("0 MB");
              Alert.alert(t("success"), t("cache_cleared"));
            } catch (error: any) {
              console.error("Error clearing storage:", error);
              
              const errorMessage = error?.message || '';
              const errorCode = error?.code;
              const underlyingError = error?.userInfo?.NSUnderlyingError;
              const underlyingCode = underlyingError?.code;
              
              if (errorMessage.includes('No such file or directory') || 
                  errorMessage.includes('無法移除') ||
                  errorMessage.includes('无法移除') ||
                  errorCode === 4 || 
                  errorCode === 'ENOENT' ||
                  underlyingCode === 2) {
                console.log('[Settings] Storage already empty, treating as success');
                setCacheSize("0 MB");
                Alert.alert(t("success"), t("cache_cleared"));
              } else {
                Alert.alert(
                  t("error"),
                  error?.message || t("cache_clear_failed")
                );
              }
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("auto_backup")}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Shield size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("enable_auto_backup")}</Text>
                <Text style={styles.settingDescription}>
                  {t("auto_backup_description")}
                </Text>
              </View>
              <Switch
                value={autoBackupEnabled}
                onValueChange={handleAutoBackupToggle}
                trackColor={{ false: Colors.card.border, true: Colors.primary.accent }}
                thumbColor={Colors.primary.bg}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Clock size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("backup_frequency")}</Text>
                <Text style={styles.settingDescription}>{t(backupFrequency)}</Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("backup_restore")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleBackupNow}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Upload size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("backup_now")}</Text>
                <Text style={styles.settingDescription}>
                  {t("last_backup")}: {lastBackupDate}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleExportData}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <Download size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("export_data")}</Text>
                <Text style={styles.settingDescription}>
                  {t("download_data_copy")}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleImportData}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <RotateCcw size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("restore_from_backup")}</Text>
                <Text style={styles.settingDescription}>
                  {t("restore_previous_backup")}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.primary.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("storage_space")}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary.accent + "20" }]}>
                <HardDrive size={24} color={Colors.primary.accent} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{t("clear_cache")}</Text>
                <Text style={styles.settingDescription}>
                  {t("release_storage_space")}
                </Text>
              </View>
              {isClearing ? (
                <ActivityIndicator size="small" color={Colors.primary.accent} />
              ) : (
                <Text style={styles.cacheSize}>{cacheSize}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
  card: {
    backgroundColor: Colors.secondary.bg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.primary.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.card.border,
    marginVertical: 12,
  },
  cacheSize: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.primary.text,
  },
});
