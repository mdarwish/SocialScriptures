
export interface AddressItem {
   type: string;
   streetAddress: string;
   city: string;
   state: string;
   postalCode: string;
}

export interface PhoneNumberItem {
   type: string;
   number: string;
}

export interface User {
   firstName: string;
   lastName: string;
   madianName: string;
   userName: string;
   password: string;
   dateOfBirth: string;
   address: Array<AddressItem>;
   phoneNumber: Array<PhoneNumberItem>;
}
