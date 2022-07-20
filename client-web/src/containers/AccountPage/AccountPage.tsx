import Label from 'components/Label/Label';
import React, { FC, useEffect, useState } from 'react';
import Avatar from 'shared/Avatar/Avatar';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import Input from 'shared/Input/Input';
import Textarea from 'shared/Textarea/Textarea';
import { Helmet } from 'react-helmet';
import { useAccount } from 'wagmi';
import HandleApi from 'api/HandleApi';
import ReactS3Client from 'react-aws-s3-typescript';
import { toast } from 'react-toastify';

const S3_BUCKET = 'uninft';
const REGION = 'ap-southeast-1';
const ACCESS_KEY = process.env.ACCESS_KEY || 'AKIA6N6UCW73QISNQJWT';
const SECRET_ACCESS_KEY =
  process.env.ACCESS_KEY || '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';

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = '' }) => {
  const [{ data: accountData }, disconnect] = useAccount();
  const [user, setUser] = useState<any>();
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatar, setAvatar] = useState('');

  const errorNotify = () => toast.error('Update Account Error!');
  const successNotify = () => toast.success('Update Account Successfully!');

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const data = await HandleApi.APIGet(`user/detail/${accountData?.address}`);
    setUser(data);
    setAvatar(data.avatar);
  };

  const handleFileInput = (e: any) => {
    setSelectedFile(e.target.files[0]);
    const img = URL.createObjectURL(e.target.files[0]);
    setAvatar(img);
  };

  const handleUpload = async (file: any) => {
    console.log('file', file);
    const s3 = new ReactS3Client(config);
    try {
      let res: any;
      let newAva: any;

      if (file) {
        res = await s3.uploadFile(file);
      }

      if (res) {
        newAva = res.location;
      }
      const body = { ...user, avatar: newAva };

      await HandleApi.APIPut(`user/update/${user.id}`, body);
      successNotify();
      console.log(res?.location);
    } catch (exception) {
      console.log(exception);
      errorNotify();
    }
  };

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <Helmet>
        <title>Account || Togethr</title>
      </Helmet>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Profile settings
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can set preferred display name, create your profile URL and
              manage other personal settings.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              <div className="relative rounded-full overflow-hidden flex">
                <Avatar sizeClass="w-32 h-32" imgUrl={avatar} />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileInput}
                />
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-5 sm:space-y-6 md:sm:space-y-7">
              {/* ---- */}
              <div>
                <Label>Username</Label>
                <Input
                  className="mt-1.5"
                  defaultValue="username"
                  value={user?.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>

              {/* ---- */}
              <div>
                <Label>Email</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-envelope"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    placeholder="example@email.com"
                    value={user?.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* ---- */}
              <div>
                <Label>Bio</Label>
                <Textarea
                  rows={5}
                  className="mt-1.5"
                  placeholder="Something about yourself in a few word."
                  value={user?.bio || ''}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                />
              </div>

              {/* ---- */}
              <div className="">
                <Label>Website</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    https://
                  </span>
                  <Input
                    className="!rounded-l-none"
                    placeholder="yourwebsite.com"
                    value={user?.website}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Wallet Address</Label>
                <div className="mt-1.5 relative text-neutral-700 dark:text-neutral-300">
                  <Input
                    className="!pr-10 "
                    disabled
                    defaultValue="0x1bde388826caab77bfe80148abdce6830606e2c6"
                    value={accountData?.address}
                  />

                  <span className="absolute right-2.5 cursor-pointer top-1/2 -translate-y-1/2 ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* ---- */}
              <div className="pt-2">
                <ButtonPrimary
                  className="w-full"
                  onClick={() => handleUpload(selectedFile)}
                >
                  Update profile
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
