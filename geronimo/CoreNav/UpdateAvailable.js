import { Text, TouchableOpacity, View, Image, Dimensions, Platform, Linking } from 'react-native';
import { useEffect, useState, } from 'react';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default UpdateAvailable = ({ }) => {

    return (

        <View style={{ position: 'absolute', top: 0, zIndex: 10, height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.6)', alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ width: '90%', backgroundColor: '#e6e6e6', borderRadius: 30, justifyContent: 'space-around', padding: 20, paddingVertical: 20 }}>

                <View style={{ backgroundColor: '#f2f2f2', borderRadius: 20, marginBottom: 20, paddingVertical: 20, paddingHorizontal: 12 }}>
                    <Text style={{ color: '#000', fontSize: 26, fontFamily: 'Aristotelica-Regular', marginBottom: -8, textAlign: 'center', }}>We've got some updates for you!</Text>
                </View>
                <Image style={{ zIndex: 99, backgroundColor: null, width: windowWidth * .7, height: windowWidth * .5, alignSelf: 'center' }} source={require('../assets/team-work.png')} autoPlay loop />

                {Platform.OS == 'android' ?

                    <TouchableOpacity onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.zbretz.theparkcityapp&pcampaignid=web_share")}
                        style={{ backgroundColor: '#ffcf56', borderRadius: 30, padding: 20, marginTop: 20 }} >
                        <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-Regular', marginBottom: -8, textAlign: 'center' }}>Update Now</Text>
                    </TouchableOpacity>

                    :

                    <TouchableOpacity onPress={() => Linking.openURL("https://apps.apple.com/us/app/the-park-city-app/id1637586494")}
                        style={{ backgroundColor: '#ffcf56', borderRadius: 30, padding: 20, marginTop: 20 }} >
                        <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-Regular', marginBottom: -8, textAlign: 'center' }}>Update Now</Text>
                    </TouchableOpacity>

                }


            </View>


        </View>



    );

}



