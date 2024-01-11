import { View, Text, ScrollView, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import Categories from '../components/Categories';
import axios from 'axios';
import Recipes from '../components/Recipes';


export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('Beef')
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])

  // useEffect(() => getCategories(), getRecipes(), [])
  useEffect(() => {
    getCategories()
    getRecipes()
  }, [])

  const getCategories = async () => {
    try {
      const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php')
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getRecipes = async (category = 'Beef') => {
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeCategory = category => {
    getRecipes(category)
    setActiveCategory(category)
    setMeals([])
  }

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='dark' />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} className='space-y-6 pt-14'>
        {/* Avatar and Bell Icon */}
        <View className='mx-4 flex-row justify-between items-center mb-2'>
          <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(5), width: hp(5.5) }} />
          <BellIcon size={hp(4)} color='gray' />
        </View>

        {/* Greetings and PunchLine */}
        <View className='mx-4 mb-2 space-y-2'>
          <Text style={{ fontSize: hp(1.7) }} className='text-neutral-600'>Hello, Shehroz</Text>
          <View>
            <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>Make your own Food</Text>
          </View>
          <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>
            Stay at <Text className='text-amber-400 font-semibold'>Home</Text>
          </Text>
        </View>

        {/* SearchBar */}
        <View className='mx-4 bg-black/5 flex-row items-center rounded-full p-[6px]'>
          <TextInput placeholder='Search any Recipe' placeholderTextColor={'gray'} style={{ fontSize: hp(1.7) }} className='flex-1 text-base mb-1 pl-3 tracking-wider' />
          <View className='bg-white rounded-full p-3'>
            <MagnifyingGlassIcon size={hp(2.5)} color={'gray'} strokeWidth={3} />
          </View>
        </View>

        {/* Categories */}
        <View>
          {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
        </View>

        {/* Recipes */}
        <View>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </View>
  )
}