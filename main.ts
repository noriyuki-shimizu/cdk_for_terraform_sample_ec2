import { App, TerraformOutput, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import * as dotenv from "dotenv";
import { AwsProvider, Instance } from './.gen/providers/aws';

dotenv.config();

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'ap-northeast-1',
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY
    })

    const instance = new Instance(this, 'sample-ec2', {
      ami: 'ami-014612c2d9afaf1ac', // Microsoft Windows Server 2019 Base
      instanceType: 't2.micro',
      tags: {
        Name: 'サンプル EC2 環境'
      },
      ebsBlockDevice: [
        {
          deviceName: '/dev/sda1',
          volumeSize: 30,
          volumeType: 'gp2'
        }
      ],
      vpcSecurityGroupIds: ['sg-960ebfe7']
    });

    new TerraformOutput(this, 'public_ip', {
      value: instance.publicIp,
    });

  }
}

const app = new App();
new MyStack(app, 'sample-ec2');
app.synth();
