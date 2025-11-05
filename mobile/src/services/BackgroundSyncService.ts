import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";
import Toast from "react-native-toast-message";
import { BackgroundSyncTask } from "../types";
import { ApiService } from "./ApiService";

class BackgroundSyncServiceClass {
  private readonly STORAGE_KEY = "@AileHekimligi:sync_tasks";
  private readonly LAST_SYNC_KEY = "@AileHekimligi:last_sync";
  private tasks: BackgroundSyncTask[] = [];
  private isRunning: boolean = false;
  private appStateSubscription: any = null;

  constructor() {
    this.initialize();
  }

  // Initialize background sync service
  private async initialize(): Promise<void> {
    await this.loadTasks();
    this.setupAppStateHandler();
    this.startPeriodicSync();
  }

  // Setup app state change handler
  private setupAppStateHandler(): void {
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange.bind(this)
    );
  }

  // Handle app state changes
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === "active") {
      // App came to foreground
      this.syncImmediately();
    } else if (nextAppState === "background") {
      // App went to background
      this.scheduleBackgroundSync();
    }
  }

  // Load tasks from storage
  private async loadTasks(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.tasks = JSON.parse(stored).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
        }));
      }
    } catch (error) {
      console.error("Failed to load sync tasks:", error);
    }
  }

  // Save tasks to storage
  private async saveTasks(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Failed to save sync tasks:", error);
    }
  }

  // Add sync task
  async addTask(
    type: "upload" | "download" | "sync",
    data: any
  ): Promise<string> {
    const task: BackgroundSyncTask = {
      id: Date.now().toString(),
      type,
      data,
      status: "pending",
      createdAt: new Date(),
    };

    this.tasks.push(task);
    await this.saveTasks();

    // Try to execute immediately if possible
    if (!this.isRunning) {
      this.processNextTask();
    }

    return task.id;
  }

  // Process next pending task
  private async processNextTask(): Promise<void> {
    if (this.isRunning) return;

    const pendingTask = this.tasks.find((task) => task.status === "pending");
    if (!pendingTask) return;

    this.isRunning = true;
    pendingTask.status = "running";
    await this.saveTasks();

    try {
      let success = false;

      switch (pendingTask.type) {
        case "upload":
          success = await this.processUploadTask(pendingTask);
          break;
        case "download":
          success = await this.processDownloadTask(pendingTask);
          break;
        case "sync":
          success = await this.processSyncTask(pendingTask);
          break;
      }

      pendingTask.status = success ? "completed" : "failed";
      pendingTask.completedAt = new Date();

      if (success) {
        Toast.show({
          type: "success",
          text1: "Senkronizasyon Tamamlandı",
          text2: "Veriler başarıyla senkronize edildi.",
        });
      }
    } catch (error) {
      console.error("Task processing error:", error);
      pendingTask.status = "failed";
      pendingTask.completedAt = new Date();
    }

    await this.saveTasks();
    this.isRunning = false;

    // Process next task if available
    setTimeout(() => this.processNextTask(), 1000);
  }

  // Process upload task
  private async processUploadTask(task: BackgroundSyncTask): Promise<boolean> {
    try {
      const { endpoint, data } = task.data;
      const response = await ApiService.post(endpoint, data);
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error("Upload task failed:", error);
      return false;
    }
  }

  // Process download task
  private async processDownloadTask(
    task: BackgroundSyncTask
  ): Promise<boolean> {
    try {
      const { endpoint } = task.data;
      const response = await ApiService.get(endpoint);

      // Store downloaded data
      await AsyncStorage.setItem(
        `@AileHekimligi:download_${task.id}`,
        JSON.stringify(response.data)
      );

      return true;
    } catch (error) {
      console.error("Download task failed:", error);
      return false;
    }
  }

  // Process sync task
  private async processSyncTask(task: BackgroundSyncTask): Promise<boolean> {
    try {
      // Sync user data
      await this.syncUserData();

      // Sync applications
      await this.syncApplications();

      // Sync kuras
      await this.syncKuras();

      // Update last sync time
      await AsyncStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());

      return true;
    } catch (error) {
      console.error("Sync task failed:", error);
      return false;
    }
  }

  // Sync user data
  private async syncUserData(): Promise<void> {
    try {
      const response = await ApiService.getUserProfile();
      await AsyncStorage.setItem(
        "@AileHekimligi:user_data",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("User data sync failed:", error);
    }
  }

  // Sync applications
  private async syncApplications(): Promise<void> {
    try {
      const response = await ApiService.getUserApplications();
      await AsyncStorage.setItem(
        "@AileHekimligi:applications",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Applications sync failed:", error);
    }
  }

  // Sync kuras
  private async syncKuras(): Promise<void> {
    try {
      const response = await ApiService.getKuraList();
      await AsyncStorage.setItem(
        "@AileHekimligi:kuras",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Kuras sync failed:", error);
    }
  }

  // Start periodic sync
  private startPeriodicSync(): void {
    // Sync every 30 minutes when app is active
    setInterval(() => {
      if (AppState.currentState === "active") {
        this.addTask("sync", { type: "periodic" });
      }
    }, 30 * 60 * 1000);
  }

  // Schedule background sync
  private scheduleBackgroundSync(): void {
    // Add a sync task to be processed when app becomes active
    this.addTask("sync", { type: "background" });
  }

  // Sync immediately
  async syncImmediately(): Promise<boolean> {
    const taskId = await this.addTask("sync", { type: "immediate" });

    // Wait for task to complete
    return new Promise((resolve) => {
      const checkStatus = () => {
        const task = this.tasks.find((t) => t.id === taskId);
        if (task && task.status !== "pending" && task.status !== "running") {
          resolve(task.status === "completed");
        } else {
          setTimeout(checkStatus, 500);
        }
      };
      checkStatus();
    });
  }

  // Get sync status
  getSyncStatus(): {
    lastSync: Date | null;
    pendingTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
  } {
    return {
      lastSync: this.getLastSyncTime(),
      pendingTasks: this.tasks.filter((t) => t.status === "pending").length,
      runningTasks: this.tasks.filter((t) => t.status === "running").length,
      completedTasks: this.tasks.filter((t) => t.status === "completed").length,
      failedTasks: this.tasks.filter((t) => t.status === "failed").length,
    };
  }

  // Get last sync time
  private getLastSyncTime(): Date | null {
    try {
      const tasks = this.tasks
        .filter((t) => t.type === "sync" && t.status === "completed")
        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());

      return tasks.length > 0 ? tasks[0].completedAt! : null;
    } catch (error) {
      return null;
    }
  }

  // Retry failed tasks
  async retryFailedTasks(): Promise<void> {
    const failedTasks = this.tasks.filter((t) => t.status === "failed");

    for (const task of failedTasks) {
      task.status = "pending";
      task.completedAt = undefined;
    }

    await this.saveTasks();
    this.processNextTask();

    Toast.show({
      type: "info",
      text1: "Yeniden Deneniyor",
      text2: `${failedTasks.length} başarısız görev yeniden deneniyor.`,
    });
  }

  // Clear completed tasks
  async clearCompletedTasks(): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.status !== "completed");
    await this.saveTasks();

    Toast.show({
      type: "info",
      text1: "Temizlik Tamamlandı",
      text2: "Tamamlanan görevler temizlendi.",
    });
  }

  // Clear all tasks
  async clearAllTasks(): Promise<void> {
    this.tasks = [];
    await this.saveTasks();

    Toast.show({
      type: "info",
      text1: "Tüm Görevler Temizlendi",
      text2: "Bekleyen görevler iptal edildi.",
    });
  }

  // Check if sync is needed
  isSyncNeeded(): boolean {
    const lastSync = this.getLastSyncTime();
    if (!lastSync) return true;

    const timeDiff = Date.now() - lastSync.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff > 2; // Sync if last sync was more than 2 hours ago
  }

  // Force full sync
  async forceFullSync(): Promise<boolean> {
    // Clear all pending sync tasks
    this.tasks = this.tasks.filter(
      (t) => t.type !== "sync" || t.status === "running"
    );

    // Add full sync task
    await this.addTask("sync", { type: "force_full" });

    return this.syncImmediately();
  }

  // Cleanup service
  cleanup(): void {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }

  // Get detailed task info
  getTaskDetails(): BackgroundSyncTask[] {
    return [...this.tasks].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Export sync data
  exportSyncData(): string {
    return JSON.stringify(
      {
        tasks: this.tasks,
        status: this.getSyncStatus(),
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }
}

export const BackgroundSyncService = new BackgroundSyncServiceClass();
