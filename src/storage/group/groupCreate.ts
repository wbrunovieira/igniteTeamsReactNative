import AsyncStorage from '@react-native-async-storage/async-storage';

import { GROUP_COLLECTION } from '@storage/storageConfig';
import { groupsGetAll } from './groupsGetAll';

export async function groupCreate(newGroup: string) {
  try {

    const storedGroups = await groupsGetAll();

    const groupAllreadyExist = storedGroups.includes(newG)

    const storage = JSON.stringify([...storedGroups, newGroup])
    
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);

  } catch (error) {

    throw error;

  }
}