import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '../components/Loading';
import YoutubeIframe from 'react-native-youtube-iframe';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';



export default function RecipeDetailScreen(props) {
  let item = props.route.params
  const [isFavorite, setIsFavorite] = useState(false)
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigation = useNavigation()

  useEffect(() => getMealData(item.idMeal), [])

  const getMealData = async (id) => {
    try {
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      // console.log(response.data)
      if (response && response.data) {
        setMeal(response.data.meals[0]);
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const ingredientIndexes = meal => {
    if (!meal) return [];
    let indexes = []
    for (let i = 1; i < 20; i++) {
      if (meal['strIngredient' + i]) {
        indexes.push(i)
      }

    }
    return indexes;
  }

  const getYoutubeVideoId = url => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }


  return (
    <ScrollView className='flex-1 bg-white' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style='dark' />

      {/* Recipe Img */}
      <View className='flex-row justify-center'>
        <Image source={{ uri: item.strMealThumb }} sharedTransitionTag={item.strMeal} style={{ width: wp(98), height: hp(45), borderRadius: 30, marginTop: 25 }} />
      </View>

      {/* Back Btn */}
      <Animated.View entering={FadeIn.delay(200).duration(1000)} className='w-full absolute flex-row justify-between items-center pt-14'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='p-2 rounded-full ml-5 bg-white'>
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#fbbf24'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} className='p-2 rounded-full mr-5 bg-white'>
          <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavorite ? 'red' : 'gray'} />
        </TouchableOpacity>
      </Animated.View>

      {/* Meal Description */}
      {loading
        ? <Loading size='large' className='mt-12' />
        : (
          <View className='px-4 flex justify-between space-y-4 pt-6'>
            <Animated.View entering={FadeInDown.duration(700).springify().damping()} className='space-y-2'>
              <Text style={{ fontSize: hp(3) }} className='font-bold flex-1 text-neutral-700'>
                {meal?.strMeal}
              </Text>
              <Text style={{ fontSize: hp(2) }} className='font-medium flex-1 text-neutral-500'>
                {meal?.strArea}
              </Text>
            </Animated.View>

            {/* Miscellaneous Data */}
            <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping()} className='flex-row justify-around'>
              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <ClockIcon size={hp(4)} strokeWidth={2.5} color={'#525252'} />
                </View>
                <View className='fle items-center py-2 space-y-1'>
                  <Text className='font-bold text-neutral-700 ' style={{ fontSize: hp(2) }}>35</Text>
                  <Text className='font-semibold text-neutral-700 ' style={{ fontSize: hp(1.3) }}>Mins</Text>
                </View>
              </View>

              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <UsersIcon size={hp(4)} strokeWidth={2.5} color={'#525252'} />
                </View>
                <View className='fle items-center py-2 space-y-1'>
                  <Text className='font-bold text-neutral-700 ' style={{ fontSize: hp(2) }}>03</Text>
                  <Text className='font-semibold text-neutral-700 ' style={{ fontSize: hp(1.3) }}>Servings</Text>
                </View>
              </View>

              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <FireIcon size={hp(4)} strokeWidth={2.5} color={'#525252'} />
                </View>
                <View className='fle items-center py-2 space-y-1'>
                  <Text className='font-bold text-neutral-700 ' style={{ fontSize: hp(2) }}>103</Text>
                  <Text className='font-semibold text-neutral-700 ' style={{ fontSize: hp(1.3) }}>Cal</Text>
                </View>
              </View>

              <View className='flex rounded-full bg-amber-300 p-2'>
                <View style={{ height: hp(6.5), width: hp(6.5) }} className='bg-white rounded-full flex items-center justify-center'>
                  <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color={'#525252'} />
                </View>
                <View className='fle items-center py-2 space-y-1'>
                  <Text className='font-bold text-neutral-700 ' style={{ fontSize: hp(2) }}></Text>
                  <Text className='font-semibold text-neutral-700 ' style={{ fontSize: hp(1.3) }}>Easy</Text>
                </View>
              </View>
            </Animated.View>

            {/* Ingredients */}
            <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping()} className='space-y-4'>
              <Text style={{ fontSize: hp(2.3) }} className='font-bold text-neutral-700 flex-1'>Ingredients</Text>
              <View className='space-y-2 ml-3'>
                {ingredientIndexes(meal).map(i => {
                  return (
                    <View className='flex-row space-x-4' key={i}>
                      <View style={{ height: hp(1.5), width: hp(1.5) }} className='rounded-full bg-amber-300' />
                      <View className='flex-row space-x-2'>
                        <Text style={{ fontSize: hp(1.7) }} className='font-extrabold text-neutral-700'>{meal['strMeasure' + i]}</Text>
                        <Text style={{ fontSize: hp(1.7) }} className='font-medium text-neutral-600'>{meal['strIngredient' + i]}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </Animated.View>

            {/* Instructions */}
            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping()} className='space-y-4'>
              <Text style={{ fontSize: hp(2.3) }} className='font-bold text-neutral-700 flex-1'>Instructions</Text>
              <Text style={{ fontSize: hp(1.6) }} className='text-neutral-700'>
                {meal?.strInstructions}
              </Text>
            </Animated.View>

            {/* Recipe Video */}
            {meal.strYoutube && (
              <Animated.View entering={FadeInDown.delay(400).duration(700).springify().damping()} className='space-y-4'>
                <Text style={{ fontSize: hp(2.3) }} className='font-bold text-neutral-700 flex-1'>Recipe Video</Text>
                <View>
                  <YoutubeIframe videoId={getYoutubeVideoId(meal.strYoutube)} height={hp(30)} />
                </View>
              </Animated.View>

            )}
          </View>
        )
      }
    </ScrollView>
  )
}